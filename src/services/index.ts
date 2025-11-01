/**
 * Главный файл экспорта всех сервисов
 * Все сервисы экспортируются как singleton instances
 */

export { BaseService } from "./base.service";

// User & Auth Services
export { userService, UserService } from "./user.service";
export { userStatusService, UserStatusService } from "./user-status.service";
export { userRoleService, UserRoleService } from "./user-role.service";
export { userStatusAuditService, UserStatusAuditService } from "./user-status-audit.service";
export { roleService, RoleService } from "./role.service";

// Location Services
export { countryService, CountryService } from "./country.service";
export { cityService, CityService } from "./city.service";

// Model Services
export { model3dService, Model3dService } from "./model3d.service";
export { modelFileService, ModelFileService } from "./model-file.service";
export { modelPreviewService, ModelPreviewService } from "./model-preview.service";
export { modelLicenseService, ModelLicenseService } from "./model-license.service";
export { modelTagService, ModelTagService } from "./model-tag.service";
export { modelRatingService, ModelRatingService } from "./model-rating.service";
export { modelCommentService, ModelCommentService } from "./model-comment.service";

// Category & Tag Services
export { categoryService, CategoryService } from "./category.service";
export { tagService, TagService } from "./tag.service";

// Collection Services
export { collectionService, CollectionService } from "./collection.service";
export { collectionItemService, CollectionItemService } from "./collection-item.service";

// Auth Services
export { authProviderService, AuthProviderService } from "./auth-provider.service";
export { authIdentityService, AuthIdentityService } from "./auth-identity.service";

// Reference Data Services
export { fileTypeService, FileTypeService } from "./file-type.service";
export { tokenTypeService, TokenTypeService } from "./token-type.service";
export { licenseService, LicenseService } from "./license.service";
