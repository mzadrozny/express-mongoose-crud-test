import express, { Request, Response } from "express";
import { User } from "../../models/User";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/users', async (req: Request, res: Response) => {

  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token
    })
  } catch (error) {
    res.status(400).send(error)
  }
});

router.post('/users/login', async (req: Request, res: Response) => {

  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({
        error: 'Login action failed! Check your credentials'
      })
    }
    const token = await user.generateAuthToken();
    res.send({
      user,
      token
    })
  } catch (error) {
    res.status(400).send(error);
  }

});

router.get('/users/me', auth, async (req: any, res: Response) => {

  res.send(req.user)
})

router.get('/users', auth, async (req: any, res: Response) => {
  User.find({}, function (err, docs) {
    if (!err) {
      res.send(docs);
    } else { throw err; }
  });
})

router.post('/users/me/logout', auth, async (req: any, res: Response) => {
  try {
    req.user.tokens = req.user.tokens.filter((token: { token: string }) => {
      return token.token != req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
});

router.post('/users/me/logoutall', auth, async (req: any, res: Response) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length)
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
});

export default router;