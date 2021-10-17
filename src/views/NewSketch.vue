<template>
  <div>
    <h1>New Sketch</h1>
    <div v-if="newHydraSlug">{{ newHydraSlug }}</div>
  </div>
</template>

<script>
import { generateSlug } from "random-word-slugs";

import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { fireStore, auth } from "@/firebase";
import { useAuth } from "@vueuse/firebase/useAuth";

export default {
  name: "NewSketch",
  data() {
    return {
      newHydraSlug: undefined,
    };
  },
  setup() {
    const { isAuthenticated, user } = useAuth(auth);
    return { isAuthenticated, user };
  },
  async mounted() {
    this.newHydraSlug = await this.generateAndCheckSlug();
    await this.savingNewSlug(this.newHydraSlug);
    await this.forwardToHydraSketch(this.newHydraSlug);
  },
  methods: {
    generateAndCheckSlug: async function () {
      const slug = generateSlug();

      const docRef = doc(fireStore, "HydraSketch", slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        console.log(slug, "Slug already exists… restarting");
        return await this.generateAndCheckSlug();
      } else {
        console.log("No such document!");
        return slug;
      }
    },
    savingNewSlug: async function (slug) {
      const { uid } = this.user;
      const hydraSketchRef = doc(fireStore, "HydraSketch", slug);
      const userRef = doc(fireStore, "user", uid);

      await setDoc(hydraSketchRef, {
        name: slug,
        author: userRef,
        public: false,
        createdAt: Timestamp.now(),
        savedGraph: {},
      });

      await updateDoc(userRef, {
        Sketches: arrayUnion(hydraSketchRef),
      });
    },
    forwardToHydraSketch: async function (slug) {
      console.log("Creating new /Hydra/" + slug);
      console.log(this.$router);
      await this.$router.push({ name: "Hydra", params: { id: slug } });
    },
  },
};
</script>

<style scoped></style>
