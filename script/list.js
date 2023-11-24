const userList = document.getElementById("userList");

const loadList = async () => {
    const response = await fetch("http://localhost:3000/userList");
    let list = [];
    if(response.ok){
        list = await response.json();
    }

    list.forEach(user => {
        const li = document.createElement("LI");
        const edit = document.createElement("BUTTON");
        edit.textContent = "EDITAR";

        edit.addEventListener("click", () => {
            location.href=`index.html?id=${user.id}`;
        })

        li.textContent = `${user.firstName} : ${user.lastName} : ${user.email} : ${user.gender} : ${user.birthDate} `
        li.appendChild(edit)
        userList.appendChild(li);
    });

}

loadList();