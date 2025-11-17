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
import { CategoryModel } from "./CategoryModel";
import { License } from "./License";
import { ThreeDModel } from "./ThreeDModel";
import { FileType } from "./FileType";
import { FileModel } from "./FileModel";
import { PreviewModel } from "./PreviewModel";
import { LicenseModel } from "./LicenseModel";
import { Tag } from "./Tag";
import { TagModel } from "./TagModel";
import { RatingModel } from "./RatingModel";
import { CommentModel } from "./CommentModel";
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
    CategoryModel: ReturnType<typeof CategoryModel.initialize>;
    License: ReturnType<typeof License.initialize>;
    ThreeDModel: ReturnType<typeof ThreeDModel.initialize>;
    FileType: ReturnType<typeof FileType.initialize>;
    FileModel: ReturnType<typeof FileModel.initialize>;
    PreviewModel: ReturnType<typeof PreviewModel.initialize>;
    LicenseModel: ReturnType<typeof LicenseModel.initialize>;
    Tag: ReturnType<typeof Tag.initialize>;
    TagModel: ReturnType<typeof TagModel.initialize>;
    RatingModel: ReturnType<typeof RatingModel.initialize>;
    CommentModel: ReturnType<typeof CommentModel.initialize>;
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
        CategoryModel: CategoryModel.initialize(sequelize),
        License: License.initialize(sequelize),
        ThreeDModel: ThreeDModel.initialize(sequelize),
        FileType: FileType.initialize(sequelize),
        FileModel: FileModel.initialize(sequelize),
        PreviewModel: PreviewModel.initialize(sequelize),
        LicenseModel: LicenseModel.initialize(sequelize),
        Tag: Tag.initialize(sequelize),
        TagModel: TagModel.initialize(sequelize),
        RatingModel: RatingModel.initialize(sequelize),
        CommentModel: CommentModel.initialize(sequelize),
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
    CategoryModel,
    License,
    ThreeDModel,
    FileType,
    FileModel,
    PreviewModel,
    LicenseModel,
    Tag,
    TagModel,
    RatingModel,
    CommentModel,
    Collection,
    CollectionItem,
    CommentAttachment,
    Country,
    City,
    Migration,
};
