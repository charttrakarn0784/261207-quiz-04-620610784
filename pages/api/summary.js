import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin)
      return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    const users = readUsersDB();
    const userCount = users
      .filter((x) => x.isAdmin === false)
      .reduce((cur, prev) => cur + 1, 0);
    const adminCount = users
      .filter((x) => x.isAdmin === true)
      .reduce((cur, prev) => cur + 1, 0);
    const totalMoney = users
      .filter((x) => x.isAdmin === false)
      .map((x) => x.money)
      .reduce((cur, prev) => cur + prev, 0);

    //return response
    return res.json({
      ok: true,
      userCount: userCount,
      adminCount: adminCount,
      totalMoney: totalMoney,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
