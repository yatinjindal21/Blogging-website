const form=document.querySelector('form');
const input=document.querySelector('input');
const div=document.querySelector('#comms')
form.addEventListener('submit',function(e){
    e.preventDefault();
    const cat=input.value;
    const user=document.createElement('div');

    const newdiv=document.createElement('div');
    
    user.style.height='2.5em';
    newdiv.style.backgroundColor='black';
    newdiv.style.color='white';
    newdiv.style.backgroundColor='#2e272c96';
    user.style.textAlign='center';
    user.style.color='white';
    user.style.paddingTop='0.2em';
    newdiv.style.paddingTop='1em';
    newdiv.style.paddingLeft='1em';
    user.style.backgroundColor='#2e272c96';
    user.style.border='0.6px solid white';
    newdiv.style.height='3em';

    newdiv.innerText=cat;
    user.innerText='user';
    div.append(user);
    div.append(newdiv);
    // newdiv.prepend(user)
    input.value="";
})
console.log("hiiiiii")