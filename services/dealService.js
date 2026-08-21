import deals from "../data/deals.json";

export function getDeals() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(deals);
    }, 500);
  });
}

export function getDealById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const deal = deals.find(
        (item) => item.id === Number(id)
      );

      if (!deal) {
        reject(new Error("Deal not found"));
        return;
      }

      resolve(deal);
    }, 500);
  });
}