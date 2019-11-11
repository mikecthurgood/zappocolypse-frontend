import React from 'react';
import './App.css';
import NavBar from './components/NavBar'
import Home from './components/Home'
import LoginForm from './components/Login'
import { Route, withRouter } from 'react-router-dom';
import API from './helpers/API';
import Skills from './components/Skills'
import Activities from './components/Activities'
import MySkills from './components/MySkills'
import MyActivities from './components/MyActivities'
import CreateAccount from './components/CreateAccount'
import ActivityPage from './components/ActivityPage';
import MainMenuSlider from "./components/MainMenu";
import UserMenu from './components/UserMenu'



class App extends React.Component {

  state = {
    user: "",
    userSkills: [],
    userActivities: [],
    userSkillZaps: [],
    selectedActivity: {},
    menuVisible: false,
    userMenuVisible: false
  }

  toggleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible, userMenuVisible: false })
  }

  toggleUserMenu = () => {
    this.setState({ userMenuVisible: !this.state.userMenuVisible, menuVisible: false })
  }

  hideMenu = () => {
    (this.state.menuVisible || this.state.userMenuVisible) && this.setState({ menuVisible: false, userMenuVisible: false })
  }



  logIn = ({ token, user }) => {

    this.setState({
      user: user.username,
      userSkills: user.skills,
      userActivities: user.activities,
      userSkillZaps: user.skillZaps,
    })
    localStorage.setItem('token', token)
  }

  logOut = () => {
    this.setState({ user: "" })
    localStorage.removeItem('token')
    this.props.history.push('/login')
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    if (token) {
      API.validates()
        .then(data => {
          if (data.error) throw Error(data.error)
          this.logIn(data)
        })
        .catch(error => {
          console.log(error)
          localStorage.removeItem('token')
        })
    }
  }

  getSkills = () => {
    API.getAllSkills()
      .then(console.log)
  }

  getActivities = () => {
    API.getAllActivities()
      .then(console.log)
  }


  totalZaps = () => {
    return Object.values(this.state.userSkillZaps).reduce((a, b) => a + b, 0)
  }

  setActivity = (activityId) => {
    // this.setState({ activityId })
    return API.getActivity(activityId).then(data => this.setState({ selectedActivity: data }))
    // return (activity)
  }


  render() {
    const { logIn } = this
    const id = ':id'

    return (
      <div className='main'>
        <NavBar user={this.state.user} logOut={this.logOut} totalZaps={this.totalZaps()} toggleMenu={this.toggleMenu} toggleUserMenu={this.toggleUserMenu} />
        {this.state.user && <MainMenuSlider menuVisible={this.state.menuVisible} hideMenu={this.hideMenu} />}
        {this.state.user && <UserMenu menuVisible={this.state.userMenuVisible} hideMenu={this.hideMenu} logout={this.logOut} />}
        {this.state.user ? <div className="logged-in-pages" onClick={this.hideMenu}>
          <Route exact path="/" component={(routerProps) => <Home {...routerProps} logIn={logIn} />} />
          <Route path={`/activities/${id}`} component={(routerProps) => <ActivityPage {...routerProps} />} />
          <Route exact path="/activities" component={(routerProps) => <Activities {...routerProps} getActivities={this.getActivities} user={this.state.user} setActivity={this.setActivity} />} />
          <Route exact path="/skills" component={(routerProps) => <Skills {...routerProps} getSkills={this.getSkills} user={this.state.user} />} />
          <Route path="/myskills" component={(routerProps) => <MySkills {...routerProps} mySkills={this.state.userSkills} user={this.state.user} />} />
          <Route path="/myactivities" component={(routerProps) => <MyActivities {...routerProps} myActivities={this.state.userActivities} user={this.state.user} />} />
          <Route path="/profile" component={Home} />
          <Route path="/my-account" component={Home} />
        </div> :
          <div className="login-pages">
            <Route path="/login" component={(routerProps) => <LoginForm {...routerProps} logIn={logIn} user={this.state.user} />} />
            <Route path="/create-account" component={(routerProps) => <CreateAccount {...routerProps} logIn={logIn} user={this.state.user} />} />
          </div>}
      </div>
    )
  }
}

export default withRouter(App);
