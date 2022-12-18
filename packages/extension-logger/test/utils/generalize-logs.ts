export const generalizeLogs = (logs: string[]) =>
  logs.map((entry) =>
    entry
      .replace(/\(id.*\)/, '(id=id)')
      .replace(/\s[0-9\.]*s/, ' 0s')
      .replace(/\sError:(.|\n)*$/, ' Error:')
  );
