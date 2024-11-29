"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHasChangedEmail = void 0;
var DomainEvent_1 = require("@/core/shared/domain/DomainEvent");
var UserHasChangedEmail = /** @class */ (function (_super) {
    __extends(UserHasChangedEmail, _super);
    function UserHasChangedEmail(aggregateId, email) {
        var _this = _super.call(this, aggregateId, "user-has-changed-email") || this;
        _this.getPayload().set("email", email);
        return _this;
    }
    UserHasChangedEmail.from = function (user) {
        return new UserHasChangedEmail(user.getIsActive().toString(), user.email);
    };
    return UserHasChangedEmail;
}(DomainEvent_1.DomainEvent));
exports.UserHasChangedEmail = UserHasChangedEmail;
