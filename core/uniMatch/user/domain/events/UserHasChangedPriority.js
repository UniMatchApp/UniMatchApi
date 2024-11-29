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
exports.UserHasChangedPriority = void 0;
var DomainEvent_1 = require("@/core/shared/domain/DomainEvent");
var UserHasChangedPriority = /** @class */ (function (_super) {
    __extends(UserHasChangedPriority, _super);
    function UserHasChangedPriority(aggregateId, priority) {
        var _a;
        var _this = _super.call(this, aggregateId, "user-has-changed-priority") || this;
        _this.getPayload().set("priority", (_a = priority === null || priority === void 0 ? void 0 : priority.toString()) !== null && _a !== void 0 ? _a : "");
        return _this;
    }
    UserHasChangedPriority.from = function (profile) {
        return new UserHasChangedPriority(profile.getId(), profile.genderPriority);
    };
    return UserHasChangedPriority;
}(DomainEvent_1.DomainEvent));
exports.UserHasChangedPriority = UserHasChangedPriority;
