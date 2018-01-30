export const parseCommand = (rawCommand) => {
  // take a command and return [command, flag, body]
  const parse = rawCommand.trim().replace(/\s+/g,' ').split(' ');
  const command = parse[0];
  const flag = (
    parse[1] &&
    parse[1].length >= 2 &&
    parse[1][0] === '-' &&
    parse[1].slice(1).split('').every(char => char.match(/[a-z]/))
  ) ? parse[1] : '';
  const body = parse.slice(flag ? 2 : 1).length ? parse.slice(flag ? 2 : 1) : '';
  console.log(`Interpreted: <${command}> <${flag}> <${body}>`);
  return [command, flag, body];
}

export const helloWorld = () => {
  console.log('Hello World!');
  return;
};

export const open = (body, flag) => {
  const http = 'https://';
  const url = body;
  const domain = '.com';

  if (flag === '-e') {
    window.open(body, '_blank');
  } else {
    window.open(http + url + domain, flag === '-a' ? '_self' : '_blank');
  }
  
  return;
};