import { World } from "../interfaces";
import { ConwaysGameEngine } from '../index';

export type buildGridTester = (expectation: World) => void;
export type buildGridTesterBuilder = (engine: ConwaysGameEngine, originRow: number, originCol: number) => buildGridTester;