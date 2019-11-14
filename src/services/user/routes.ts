import express, { Request, Response } from "express";
import { User } from "../../models/User";
import auth from "../../middleware/auth";
import { findAllUsers } from "./UserController";

export default [
  {
    path: "/users/me",
    method: "get",
    handler: [
      auth,
      async (req: any, res: Response) => {
        try {
          const user = await User.findOne({
            _id: req.userId,
          })
          if (!user) {
            throw new Error();
          }
          req.user = user;
        } catch (error) {
          res.status(401).send({
            error: 'Not authorized to access this resource'
          })
        }
        res.send(req.user)
      }
    ]
  },
  {
    path: "/users",
    method: "get",
    handler: [
      auth,
      async (req: any, res: Response) => {
        const result = await findAllUsers();

        res.json(result);
      }
    ]
  },
  {
    path: "/users",
    method: "post",
    handler: [
      async (req: any, res: Response) => {
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
      }
    ]
  },
  {
    path: "/users/login",
    method: "post",
    handler: [
      async (req: any, res: Response) => {
        const {
          email,
          password
        } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
          res.status(401).send({
            error: 'Login action failed! Check your credentials'
          });
        }
        const token = await user.generateAuthToken();
        res.send({
          user,
          token
        })
        res.send(req);
      }
    ]
  },
];
