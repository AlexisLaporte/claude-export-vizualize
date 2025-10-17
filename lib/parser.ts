export interface ClaudeMessage {
  type: 'user' | 'assistant' | 'tool-call' | 'tool-result';
  content: string;
  toolName?: string;
  toolArgs?: string;
  hasMore?: boolean;
  moreLines?: number;
}

export interface ParsedExport {
  header: {
    version: string;
    model: string;
    directory: string;
  };
  messages: ClaudeMessage[];
}

export function parseClaudeExport(text: string): ParsedExport {
  const lines = text.split('\n');

  // Parse header
  const versionMatch = text.match(/Claude Code v([\d.]+)/);
  const modelMatch = text.match(/(Sonnet|Opus|Haiku)[\s\d.]+·\s+(.+)/);
  const dirMatch = text.match(/\s+(\/[^\n]+)\s*\n>/);

  const header = {
    version: versionMatch?.[1] || 'unknown',
    model: modelMatch ? `${modelMatch[1]} ${modelMatch[2]}`.trim() : 'unknown',
    directory: dirMatch?.[1] || 'unknown',
  };

  const messages: ClaudeMessage[] = [];
  let i = 0;

  // Skip header (first few lines with ASCII art)
  while (i < lines.length && !lines[i].trim().startsWith('>')) {
    i++;
  }

  while (i < lines.length) {
    const line = lines[i];

    // User message
    if (line.trim().startsWith('>')) {
      messages.push({
        type: 'user',
        content: line.replace(/^\s*>\s*/, '').trim(),
      });
      i++;
    }
    // Assistant message or tool call
    else if (line.trim().startsWith('●')) {
      const firstLine = line.replace(/^\s*●\s*/, '').trim();

      // Check if it's a tool call (contains parentheses)
      const toolCallMatch = firstLine.match(/^(\w+)\((.+?)\)(?:\s+(.+))?$/);
      if (toolCallMatch) {
        messages.push({
          type: 'tool-call',
          toolName: toolCallMatch[1],
          toolArgs: toolCallMatch[2],
          content: toolCallMatch[3] || '',
        });
        i++;
      } else {
        // It's an assistant message - collect all continuation lines
        let content = firstLine;
        i++;

        // Collect continuation lines until next marker
        while (i < lines.length && !lines[i].trim().match(/^[>●⎿]/)) {
          const nextLine = lines[i];
          // Preserve indentation for continuation lines
          if (nextLine.trim()) {
            content += '\n' + nextLine.trimStart();
          } else if (content && i + 1 < lines.length && !lines[i + 1].trim().match(/^[>●⎿]/)) {
            // Add blank lines only if they're between content
            content += '\n';
          }
          i++;
        }

        messages.push({
          type: 'assistant',
          content: content.trim(),
        });
      }
    }
    // Tool result
    else if (line.trim().startsWith('⎿')) {
      let resultContent = line.replace(/^\s*⎿\s*/, '').trim();
      i++;

      // Collect continuation lines
      while (i < lines.length && !lines[i].trim().match(/^[>●⎿]/)) {
        const nextLine = lines[i].trim();
        if (nextLine) {
          resultContent += '\n' + nextLine;
        }
        i++;
      }

      // Check for "... +X lines" pattern
      const moreMatch = resultContent.match(/…\s*\+(\d+)\s+lines/);

      messages.push({
        type: 'tool-result',
        content: resultContent,
        hasMore: !!moreMatch,
        moreLines: moreMatch ? parseInt(moreMatch[1]) : undefined,
      });
    }
    else {
      i++;
    }
  }

  return { header, messages };
}
