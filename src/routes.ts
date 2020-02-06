const RegisterController = require('./controller/RegisterController');

export const Routes = [{
    method: "get",
    route:"/api/commonstudents/",
    controller: RegisterController,
    action: "commonstudents"
}, {
    method: "post",
    route: "/api/register",
    controller: RegisterController,
    action: "register"
}, {
    method: "post",
    route: "/api/suspend",
    controller: RegisterController,
    action: "suspend"
},
{
    method: "post",
    route: "/api/retrievefornotifications",
    controller: RegisterController,
    action:  "notification"
}
];