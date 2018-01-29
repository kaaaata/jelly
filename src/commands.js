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