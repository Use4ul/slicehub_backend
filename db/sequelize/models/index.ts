import { Sequelize } from "sequelize";
import { User } from "./User";
import { UserStatus } from "./UserStatus";
import { Role } from "./Role";
import { UserRole } from "./UserRole";
import { TokenType } from "./TokenType";
import { UserToken } from "./UserToken";
import { StorageType } from "./StorageType";
import { Profile } from "./Profile";
import { AuthProvider } from "./AuthProvider";
import { AuthIdentity } from "./AuthIdentity";
import { UserStatusAudit } from "./UserStatusAudit";
import { ModelCategory } from "./ModelCategory";
import { License } from "./License";
import { Model3d } from "./Model3d";
import { FileType } from "./FileType";
import { ModelFile } from "./ModelFile";
import { ModelPreview } from "./ModelPreview";
import { ModelLicense } from "./ModelLicense";
import { Tag } from "./Tag";
import { ModelTag } from "./ModelTag";
import { ModelRating } from "./ModelRating";
import { ModelComment } from "./ModelComment";
import { Collection } from "./Collection";
import { CollectionItem } from "./CollectionItem";
import CommentAttachment from "./CommentAttachment";
import Country from "./Country";
import City from "./City";
import { Migration } from "./Migration";

export interface Models {
    User: ReturnType<typeof User.initialize>;
    UserStatus: ReturnType<typeof UserStatus.initialize>;
    Role: ReturnType<typeof Role.initialize>;
    UserRole: ReturnType<typeof UserRole.initialize>;
    TokenType: ReturnType<typeof TokenType.initialize>;
    UserToken: ReturnType<typeof UserToken.initialize>;
    StorageType: ReturnType<typeof StorageType.initialize>;
    Profile: ReturnType<typeof Profile.initialize>;
    AuthProvider: ReturnType<typeof AuthProvider.initialize>;
    AuthIdentity: ReturnType<typeof AuthIdentity.initialize>;
    UserStatusAudit: ReturnType<typeof UserStatusAudit.initialize>;
    ModelCategory: ReturnType<typeof ModelCategory.initialize>;
    License: ReturnType<typeof License.initialize>;
    Model3d: ReturnType<typeof Model3d.initialize>;
    FileType: ReturnType<typeof FileType.initialize>;
    ModelFile: ReturnType<typeof ModelFile.initialize>;
    ModelPreview: ReturnType<typeof ModelPreview.initialize>;
    ModelLicense: ReturnType<typeof ModelLicense.initialize>;
    Tag: ReturnType<typeof Tag.initialize>;
    ModelTag: ReturnType<typeof ModelTag.initialize>;
    ModelRating: ReturnType<typeof ModelRating.initialize>;
    ModelComment: ReturnType<typeof ModelComment.initialize>;
    Collection: ReturnType<typeof Collection.initialize>;
    CollectionItem: ReturnType<typeof CollectionItem.initialize>;
    CommentAttachment: ReturnType<typeof CommentAttachment.initialize>;
    Country: ReturnType<typeof Country.initialize>;
    City: ReturnType<typeof City.initialize>;
    Migration: ReturnType<typeof Migration.initialize>;
}

export function initializeModels(sequelize: Sequelize): Models {
    // Инициализация всех моделей
    const models = {
        User: User.initialize(sequelize),
        UserStatus: UserStatus.initialize(sequelize),
        Role: Role.initialize(sequelize),
        UserRole: UserRole.initialize(sequelize),
        TokenType: TokenType.initialize(sequelize),
        UserToken: UserToken.initialize(sequelize),
        StorageType: StorageType.initialize(sequelize),
        Profile: Profile.initialize(sequelize),
        AuthProvider: AuthProvider.initialize(sequelize),
        AuthIdentity: AuthIdentity.initialize(sequelize),
        UserStatusAudit: UserStatusAudit.initialize(sequelize),
        ModelCategory: ModelCategory.initialize(sequelize),
        License: License.initialize(sequelize),
        Model3d: Model3d.initialize(sequelize),
        FileType: FileType.initialize(sequelize),
        ModelFile: ModelFile.initialize(sequelize),
        ModelPreview: ModelPreview.initialize(sequelize),
        ModelLicense: ModelLicense.initialize(sequelize),
        Tag: Tag.initialize(sequelize),
        ModelTag: ModelTag.initialize(sequelize),
        ModelRating: ModelRating.initialize(sequelize),
        ModelComment: ModelComment.initialize(sequelize),
        Collection: Collection.initialize(sequelize),
        CollectionItem: CollectionItem.initialize(sequelize),
        CommentAttachment: CommentAttachment.initialize(sequelize),
        Country: Country.initialize(sequelize),
        City: City.initialize(sequelize),
        Migration: Migration.initialize(sequelize),
    };

    // Установка связей после инициализации всех моделей
    Object.values(models).forEach((model) => {
        if ('associate' in model && typeof model.associate === 'function') {
            model.associate(models);
        }
    });

    return models;
}

export {
    User,
    UserStatus,
    Role,
    UserRole,
    TokenType,
    UserToken,
    StorageType,
    Profile,
    AuthProvider,
    AuthIdentity,
    UserStatusAudit,
    ModelCategory,
    License,
    Model3d,
    FileType,
    ModelFile,
    ModelPreview,
    ModelLicense,
    Tag,
    ModelTag,
    ModelRating,
    ModelComment,
    Collection,
    CollectionItem,
    CommentAttachment,
    Country,
    City,
    Migration,
};
