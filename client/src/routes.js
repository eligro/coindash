import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import DashboardPage from './components/pages/dashboard/DashboardPage.react';
import AccountPage from './components/pages/account/AccountPage.react';
import CopyCryptoPage from './components/pages/copycrypto/CopyCryptoPage.react';
import PeoplePage from './components/pages/copycrypto/people/PeoplePage.react';
import SettingsPage from './components/settings/SettingsPage.react';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={DashboardPage}/>
        <Route path="accounts" component={AccountPage}/>
        <Route path="copycrypto" component={CopyCryptoPage}/>
        <Route path="people/:user" component={PeoplePage} />
        <Route path="settings" component={SettingsPage}/>
    </Route>
)
