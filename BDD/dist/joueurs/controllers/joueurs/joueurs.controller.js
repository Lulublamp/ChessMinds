"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoueursController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const CreateJoueurs_dto_1 = require("../../dtos/CreateJoueurs.dto");
const joueurs_service_1 = require("../../service/joueurs/joueurs.service");
let JoueursController = class JoueursController {
    constructor(joueursService) {
        this.joueursService = joueursService;
    }
    getCustomRepositoryToken() { }
    createJoueur(createJoueurDto) {
        this.joueursService.createJoueur(createJoueurDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JoueursController.prototype, "getCustomRepositoryToken", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateJoueurs_dto_1.CreateJoueursParam]),
    __metadata("design:returntype", void 0)
], JoueursController.prototype, "createJoueur", null);
JoueursController = __decorate([
    (0, common_1.Controller)('joueurs'),
    __metadata("design:paramtypes", [joueurs_service_1.JoueursService])
], JoueursController);
exports.JoueursController = JoueursController;
//# sourceMappingURL=joueurs.controller.js.map