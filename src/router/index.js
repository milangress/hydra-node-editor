import Vue from "vue";
import VueRouter from "vue-router";
import Hydra from "../views/Hydra.vue";
import NewSketch from "@/views/NewSketch";
import Start from "@/views/Start";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Start",
    component: Start,
  },
  {
    path: "/new",
    name: "New Sketch",
    component: NewSketch,
  },
  {
    path: "/hydra/:id",
    name: "Hydra",
    component: Hydra,
  },
  {
    path: "/iFrameGen/:code",
    name: "iFrameGen",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "iFrameGen" */ "../views/iFrameGen.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
