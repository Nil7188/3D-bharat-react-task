import investors from "../data/investors.json";

export function getInvestors() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(investors);
    }, 600);
  });
}

export function getInvestorById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const investor = investors.find(
        (item) => item.id === Number(id)
      );

      if (!investor) {
        reject(new Error("Investor not found"));
        return;
      }

      resolve(investor);
    }, 600);
  });
}