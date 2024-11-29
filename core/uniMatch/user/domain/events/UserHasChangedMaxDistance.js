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
exports.UserHasChangedMaxDistance = void 0;
var DomainEvent_1 = require("@/core/shared/domain/DomainEvent");
var UserHasChangedMaxDistance = /** @class */ (function (_super) {
    __extends(UserHasChangedMaxDistance, _super);
    function UserHasChangedMaxDistance(aggregateId, distance) {
        var _this = _super.call(this, aggregateId, "user-has-changed-max-distance") || this;
        _this.getPayload().set("distance", distance.toString());
        return _this;
    }
    UserHasChangedMaxDistance.from = function (profile) {
        return new UserHasChangedMaxDistance(profile.getId(), profile.maxDistance);
    };
    return UserHasChangedMaxDistance;
}(DomainEvent_1.DomainEvent));
exports.UserHasChangedMaxDistance = UserHasChangedMaxDistance;
