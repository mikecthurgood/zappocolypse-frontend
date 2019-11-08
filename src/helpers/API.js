const baseUrl = 'http://localhost:3000/'
const signInUrl = baseUrl + 'signin'
const validateUrl = baseUrl + 'validate'
const allSkillsUrl = baseUrl + 'skills'
const mySkillsUrl = baseUrl + 'myskills'

class API {
    static signIn = (username, password) => this.post(signInUrl, { username, password })

    static validates = () => this.get(validateUrl)


    static getAllSkills = () => this.get(allSkillsUrl)

    static getMySkills = () => this.get(mySkillsUrl)

    static get = (url) =>
        fetch(url, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(resp => resp.json())


    static post = (url, data) =>
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(resp => resp.json())
}

export default API