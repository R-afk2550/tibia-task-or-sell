import armors from "./armors.json";
import boots from "./boots.json";
import creatureProducts from "./creature-products.json";
import helmets from "./helmets.json";
import legs from "./legs.json";
import shields from "./shields.json";
import weapons from "./weapons.json";

export type ItemCategory =
  | "Armors"
  | "Boots"
  | "Creature Products"
  | "Helmets"
  | "Legs"
  | "Shields"
  | "Weapons";

export interface TibiaItem {
  name: string;
  category: ItemCategory;
  npc_buy_price: number;
}

export const tibiaItems: TibiaItem[] = [
  ...armors,
  ...boots,
  ...creatureProducts,
  ...helmets,
  ...legs,
  ...shields,
  ...weapons,
];

export {
  armors,
  boots,
  creatureProducts,
  helmets,
  legs,
  shields,
  weapons,
};
