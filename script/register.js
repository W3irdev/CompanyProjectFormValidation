const username = document.getElementById("name");
const surname = document.getElementById("surname");
const email = document.getElementById("email");
const gender = document.getElementById("gender");
const birthdate = document.getElementById("birthdate");
const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;
const isEmailValid = (email) => {
    const re = /^(([^<>()\].,;:\s@"]+(\.[()\[\\.,;:\s@"]+)*)|(".+"))@(([0−9]1,3\.[0−9]1,3\.[0−9]1,3\.[0−9]1,3)|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
let id = window.location.search || "";
const form = document.querySelector("form");
const statusMessage = document.getElementById("status");
const button = document.querySelector("button");

const showError = (input, message) => {
    // Obtener el elemento form-field
    const formField = input.parentElement;
    // Agregar la clase de error
    formField.classList.remove('success');
    formField.classList.add('error');
    // Mostrar el mensaje de error
    const error = formField.querySelector('small');
    error.textContent = message;
  };

const showSuccess = (input) => {
    // Obtener el elemento form-field
    const formField = input.parentElement;
    // Eliminar la clase de error
    formField.classList.remove('error');
    formField.classList.add('success');
    // Ocultar el mensaje de error
    const error = formField.querySelector('small');
    error.textContent = '';
  };

const checkUsername = () => {
    let valid = false;
    if(username.value && /^[A-ZÑ][a-zñ]/.test(username.value)){
        showSuccess(username);
        valid = true;
    }else{
        showError(username,"El nombre debe ser caracteres alfabeticos");
    }
    return valid;
}

const checkSurname = () => {
    let valid = false;
    if(surname.value && /^[A-ZÑ][a-zñ]/.test(surname.value)){
        showSuccess(surname);
        valid = true;
    }else{
        showError(surname,"El nombre debe ser caracteres alfabeticos");
    }
    return valid;
}

const checkEmail = async () => {
    let valid = false;
    if(!email.value){
        showError(email, "Debe rellenar este campo");
    }else if(!isEmailValid(email.value)){
        showError(email, "No cumple los requisitos")
    }else if(await checkEmailApi(email)){
            showSuccess(email);
            valid = true;
        }
    return valid;
    }


const checkGender = () => {
    let valid = false;

    if(!gender.value){
        showError(gender, "Debe seleccionar una opcion");
    }else if("HMO".indexOf(gender.value)==-1){
        showError(gender, "Elige una opcion valida Hombre, Mujer u Otros")
    }else{
        showSuccess(gender);
        valid = true;
    }
    return valid;
}

const checkBirthDate = () => {
    let valid = false;
    if(!birthdate.value){
        showError(birthdate, "Debe completar este campo")
    }else if(Date.parse(birthdate.value)>Date.now()){
        showError(birthdate, "La fecha de nacimiento es posterior a la actual");
    }else{
        showSuccess(birthdate);
        valid = true;
    }
    return valid;
}

username.addEventListener("change", checkUsername);
surname.addEventListener("change", checkSurname);
email.addEventListener("change", checkEmail);
gender.addEventListener("change", checkGender);
birthdate.addEventListener("change", checkBirthDate);

const checkEmailApi = async (email) => {
    let exist = false;
    const response = await fetch("http://localhost:3000/userList?email="+email.value);
    const listUser = await response.json();
    if(listUser.length>0){
        showError(email, "Ese email ya esta en uso");
    }else{
        showSuccess(email);
        exist = true;
    }
    return exist;
}

const addToApi = async (userData) => {

    const response = await fetch("http://localhost:3000/userList", {method:"POST", headers:{"Content-type":"application/json"}, body:JSON.stringify(userData)});

    if(response.status===200){
        const newUser = await response.json();

        alert("Usuario registrado con exito");
    }

}

const modUser = (user) => {

    const response = fetch(`http://localhost:3000/userList/${id}`,{method:"PUT",headers:{"Content-type":"application/json"}, body:JSON.stringify(user)})
    .then(response => statusMessage.textContent=response.statusText)
    .catch(error => console.log(error));

}
const chargeDetails = async () => {

    const response = await fetch(`http://localhost:3000/userList${id}`);
    id=window.location.search.split("=")[1];

    if(response.ok){
        const jsonData = await response.json();
        const user = jsonData[0];

        username.value = user.firstName;
        surname.value = user.lastName;
        email.value = user.email;
        gender.value = user.gender;
        birthdate.value = user.birthDate;

    }

}

if(id){
    
    chargeDetails();
    button.textContent="Editar";
    email.disabled=true;
    document.addEventListener("submit", (event)=>{
        event.preventDefault();
        if(checkUsername() && checkSurname() && checkGender()){
            const userData = {firstName:username.value, lastName:surname.value, gender:gender.value, birthDate:birthdate.value};
            modUser(userData);
            form.reset();
        }
    })
}else{

    document.addEventListener("submit", async (event)=>{
        if(checkUsername() && checkSurname() && await checkEmail() && checkGender()){
            const userData = {firstName:username.value, lastName:surname.value, email:email.value, gender:gender.value, birthDate:birthdate.value};
            addToApi(userData);
        }
    })
}

