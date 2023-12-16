import { AccountsResolvers } from "./accounts/resolvers.js";
import { ProductsResolvers } from "./products/resolvers.js";


export const resolvers = [ AccountsResolvers, ProductsResolvers, ] as const
