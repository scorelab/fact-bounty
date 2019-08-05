import React from 'react'
import { Link } from 'react-router-dom'
import './style.sass'

const DashboardSideNav = () => {
  return (
    <div className="dashboard-side-nav-container">
      <ul className="links">
        <li>
          <Link className="link" to="/dashboard/posts">
            Posts
          </Link>
        </li>
        <hr />
        <li>
          <Link className="link" to="/dashboard/twitter">
            Twitter
          </Link>
        </li>
        <hr />
        <li>
          <Link className="link" to="/dashboard/search">
            Search
          </Link>
        </li>
        <hr />
      </ul>
    </div>
  )
}

DashboardSideNav.propTypes = {}
export default DashboardSideNav
