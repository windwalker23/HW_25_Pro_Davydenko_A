const API = "https://63104dd6826b98071a3d9b42.mockapi.io";

const controller = async (path, method = "GET", body) => {
	const URL = API + path;

	const params = {
		method,
		headers: {
			"content-type": "application/json",
		}
	}

	if(body) {
		params.body = JSON.stringify(body);
	}

	let request = await fetch(URL, params);
	let response = await request.json();

	return response;
}

// REGISTRATION HERO

const regForm = document.getElementById("heroes_form");
const selectUnvierse = document.getElementById("select_Universes");

controller("/universes")
    .then(data => {
        let optionUniverse = [];
        data.map(elem => {
            optionUniverse.push(`<option value="${elem.name}">${elem.name}</option>`)
        })
        selectUnvierse.innerHTML = optionUniverse.join("");
    })

regForm.addEventListener("submit", async e => {
	e.preventDefault();
    
    const heroName = regForm.querySelector("#hero_name").value;
    const favourite = regForm.querySelector("#favourite").checked;
    const heroes = await controller("/heroes");
    const hero = heroes.find(pers => pers.name.toLowerCase() === heroName.toLowerCase());

    if(hero) {
		console.log("Hero already exist!");
    } else {
        const body =  {
            name: heroName,
            comics: selectUnvierse.value,
            favourite: favourite,
		};

        controller("/heroes", "POST", body)
        .then(data => {
            let newHero = new Hero(data);
            newHero.renderHero();
        })
    }
})

// CREATE HEROES

const tbody = document.getElementById("hero_tbody");

class Hero {
    constructor(obj) {
        for(let key in obj) {
            this[key] = obj[key];
        }
    }


    renderHero() {
        const tr = document.createElement("tr");
        const checked = this.favourite ? "checked" : "";
        
        tr.innerHTML = `<tr>
                            <td>${this.name}</td>
                            <td>${this.comics}</td>
                            <td><input type="checkbox" id="checkbox-${this.id}" ${checked}></td>
                            <td><button>Delete</button></td>
                        </tr>`;
        
        tbody.append(tr);

        const checkbox = tr.querySelector("input");
        const deleteButton = tr.querySelector("button")

        this.checkboxHero(checkbox);
        this.deleteHero(deleteButton, tr);
    }

    checkboxHero(checkbox) {

        checkbox.addEventListener("change", async () => {
            const body =  {
                favourite: checkbox.checked
			}
			const response = await controller(`/heroes/${this.id}`, "PUT", body)
        })
    }

    deleteHero(deleteButton, tr) {
        deleteButton.addEventListener("click", async () => {
			const response = await controller(`/heroes/${this.id}`, "DELETE");

			if(response.id) {
                console.log(response.id);
                tr.innerHTML = "";
			}
		})
    }
}

controller("/heroes")
.then(data => {
    data.map(elem =>{
        let hero = new Hero(elem);
        hero.renderHero();
    })
})