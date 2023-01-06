import { GithubUsers } from "./users.js"

export class favoritesData {
    constructor(element) {
        this.root = document.querySelector(element)
        this.tbody = this.root.querySelector('tbody')
        this.load()
        this.onAdd()
        this.emptyScreen()
    }

    load() {
        this.users = JSON.parse(localStorage.getItem('@Git-Favs:')) || []
    }

    save() {
        localStorage.setItem("@Git-Favs:", JSON.stringify(this.users))
    }

    async add(username) {
        try {
            const user = await GithubUsers.search(username)

            const userExists = this.users.find(user => user.login == username)

            if (userExists) {
                throw new Error("Este usuário já foi adicionado na lista")
            }

            if (user.login == undefined || null) {
                throw new Error("Usuário não encontrado")
            }
            this.users = [user, ...this.users]
            this.update()
            this.emptyScreen()
            this.save()
        } catch (e) {
            alert(e.message)
        }
    }

    emptyScreen () {
        const screen = this.root.querySelector('.empty-table')
        if(this.users.length <= 0) {
            screen.classList.remove('hide')
        } else if(this.users.length > 0) {
            screen.classList.add('hide')
        }
    }

    onAdd() {
        const favoriteButton = this.root.querySelector('.input-wrapper button')
        favoriteButton.onclick = () => {
            const { value } = this.root.querySelector('.input-wrapper input')
            this.add(value)
        }
    }

    delete(user) {
        const filteredUser = this.users
            .filter(entry => entry.name != user.name)
        this.users = filteredUser
        this.update()
        this.emptyScreen()
        this.save()
    }
}

export class favoritesEdit extends favoritesData {
    constructor(element) {
        super(element)
        this.update()
    }

    update() {
        this.removeAllTr()
        this.users.forEach(user => {
            const row = this.addItem()
            row.querySelector('.profile img').src = `https://github.com/${user.login}.png`
            row.querySelector('.name a').href = `https://github.com/${user.login}`
            row.querySelector('.name a').textContent = user.login
            row.querySelector('.name p').textContent = user.name
            row.querySelector('.repos p').textContent = user.public_repos
            row.querySelector('.follows p').textContent = user.followers
            row.querySelector('.delete button').onclick = () => {
                const isOk = confirm("Você tem certeza que deseja remover este usuário?")

                if (isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
    }

    addItem() {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <tr>
            <td class="profile">
                <img src="https://avatars.githubusercontent.com/u/107001881?v=4" alt="">
                <div class="name">
                    <p>Luan Chyrstian</p>
                    <a href="https://github.com/LuanC14" target="_blank">/luanC14</a>
                </div>
            </td>
            <td class="repos">
                <p>14</p>
            </td>
            <td class="follows">
                <p>12</p>
            </td>
            <td class="delete">
                <button>remover</button>
            </td>

        </tr>
            `
        return tr
    }

    removeAllTr() {
        const trNode = this.tbody.querySelectorAll('tr')
        trNode.forEach((tr) => {
            tr.remove()
        })
    }
}