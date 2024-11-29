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
exports.UserHasChangedTypeOfRelationship = void 0;
var DomainEvent_1 = require("@/core/shared/domain/DomainEvent");
var UserHasChangedTypeOfRelationship = /** @class */ (function (_super) {
    __extends(UserHasChangedTypeOfRelationship, _super);
    function UserHasChangedTypeOfRelationship(aggregateId, relationshipType) {
        var _this = _super.call(this, aggregateId, "user-has-changed-type-of-relationship") || this;
        _this.getPayload().set("relationshipType", relationshipType.toString());
        return _this;
    }
    UserHasChangedTypeOfRelationship.from = function (profile) {
        return new UserHasChangedTypeOfRelationship(profile.getId(), profile.relationshipType);
    };
    return UserHasChangedTypeOfRelationship;
}(DomainEvent_1.DomainEvent));
exports.UserHasChangedTypeOfRelationship = UserHasChangedTypeOfRelationship;
