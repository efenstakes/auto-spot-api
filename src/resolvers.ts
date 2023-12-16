import { AccountsResolvers } from "./accounts/resolvers.js";
import { OrdersResolvers } from "./orders/resolvers.js";
import { ProductsResolvers } from "./products/resolvers.js";


export const resolvers = [ AccountsResolvers, ProductsResolvers, OrdersResolvers, ] as const
