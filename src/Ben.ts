import { CakeManager } from "./CakeManager";

export class Ben {
    constructor(private cakeManager: CakeManager) {}

    public canEatCake(): boolean {
        return this.cakeManager.isThereCake();
    }
}