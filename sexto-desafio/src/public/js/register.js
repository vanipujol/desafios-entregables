const form = document.getElementById('registerForm');

form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);

    fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(result=>result.json()).then(result=>{
        if(result.status===200){
            console.log(result)
        }else{
            console.log(result);
            alert("Debes ingresar todos los campos")
        }
    })
})