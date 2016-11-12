import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import DashboardPage from './components/pages/dashboard/DashboardPage.react';
import AccountPage from './components/pages/account/AccountPage.react';
import SettingsPage from './components/settings/SettingsPage.react';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={DashboardPage}/>
        <Route path="account" component={AccountPage}/>
        <Route path="settings" component={SettingsPage}/>
    </Route>
)
