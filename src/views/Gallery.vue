<template>
  <div class="container">
    <div>{{ hydraSketches }}</div>
  </div>
</template>

<script>
import { collection, doc, query, where, getDocs } from "firebase/firestore";
import { fireStore, auth } from "@/firebase";
import { useAuth } from "@vueuse/firebase/useAuth";

export default {
  name: "Gallery",
  setup() {
    // const { isAuthenticated, user } = useAuth(auth);
    // return { isAuthenticated, user };
  },
  data() {
    return {
      hydraSketches: [],
    };
  },
  async mounted() {
    const { user } = useAuth(auth);
    await this.loadOwnHydras(user);
  },
  methods: {
    loadOwnHydras: async function (user) {
      const { uid } = user;
      console.log(uid);
      const userRef = doc(fireStore, "user", uid);
      const hydraRef = collection(fireStore, "HydraSketch");

      const q = query(hydraRef, where("autor", "==", userRef));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.hydraSketches.push(doc.data());
      });
    },
  },
};
</script>

<style scoped></style>
