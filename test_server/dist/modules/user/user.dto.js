"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverUserInfoDTO = exports.CreateUserResponseDTO = void 0;
const dto_base_1 = require("../../core/base_classes/dto.base");
/**
 * DTO for returning user data in API responses.
 * Extends BaseDTO to ensure consistent entity-to-DTO conversion.
 *
 * @extends BaseDTO<IUser>
 */
class CreateUserResponseDTO extends dto_base_1.BaseDTO {
    /**
     * Maps IUser entity to CreateUserResponseDTO.
     * @param user - Source user entity
     */
    constructor(user) {
        super(user);
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.avatar = user.avatar;
    }
}
exports.CreateUserResponseDTO = CreateUserResponseDTO;
class RecoverUserInfoDTO extends dto_base_1.BaseDTO {
    constructor(user) {
        super(user);
        this.name = user.name;
        this.email = user.email;
        this.avatar = user.avatar;
    }
}
exports.RecoverUserInfoDTO = RecoverUserInfoDTO;
