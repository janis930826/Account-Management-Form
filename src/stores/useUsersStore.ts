import { defineStore } from "pinia";

export interface User {
  id: number;
  meta: string;
  type: "Локальная" | "LDAP";
  login: string;
  password: string | null;
  isValid: boolean;
  errors: {
    login: boolean;
    password: boolean;
    meta: boolean;
  };
}

let idCounter = 0;

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    addUser() {
      const newUser: User = {
        id: ++idCounter,
        meta: "",
        type: "Локальная",
        login: "",
        password: "",
        isValid: false,
        errors: {
          login: false,
          password: false,
          meta: false,
        },
      };
      this.users.unshift(newUser);
      this.saveToStorage();
    },
    deleteUser(id: number) {
      this.users = this.users.filter((user) => user.id !== id);
      this.saveToStorage();
    },
    updateUser(id: number, updates: Partial<User>) {
      const userIndex = this.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        this.validateUser(id);
        this.saveToStorage();
      }
    },
    validateUser(id: number) {
      const user = this.users.find((u) => u.id === id);
      if (!user) return;

      const errors = {
        login: !user.login.trim() || user.login.length > 100,
        password:
          user.type === "Локальная" &&
          (!user.password || user.password.length > 100),
        meta: user.meta.length > 50,
      };

      user.errors = errors;
      user.isValid = !Object.values(errors).some((error) => error);
    },
    loadFromStorage() {
      const stored = localStorage.getItem("users");
      if (stored) {
        try {
          const parsedUsers = JSON.parse(stored);
          this.users = parsedUsers.map((user: any) => ({
            ...user,
            password: user.type === "LDAP" ? null : user.password,
            isValid: false,
            errors: {
              login: false,
              password: false,
              meta: false,
            },
          }));
          // Validate all users after loading
          this.users.forEach((user) => this.validateUser(user.id));
        } catch (error) {
          console.error("Failed to load users from storage:", error);
        }
      }
    },
    saveToStorage() {
      const usersToSave = this.users.map((user) => ({
        ...user,
        password: user.type === "LDAP" ? null : user.password,
      }));
      localStorage.setItem("users", JSON.stringify(usersToSave));
    },
  },
});
