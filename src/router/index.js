import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Adventure from "../views/Adventure.vue";
import Load from "../views/Load.vue";
import Admin from "../views/Admin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/adventure",
    name: "Adventure",
    component: Adventure
  },
  {
    path: "/load",
    name: "Load",
    component: Load
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
