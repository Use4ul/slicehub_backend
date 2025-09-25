import { Sequelize } from 'sequelize';
import { User } from './User';
import { UserStatus } from './UserStatus';
import { Role } from './Role';
import { UserRole } from './UserRole';
import { TokenType } from './TokenType';
import { UserToken } from './UserToken';
import { StorageType } from './StorageType';
import { Profile } from './Profile';
import { AuthProvider } from './AuthProvider';
import { AuthIdentity } from './AuthIdentity';
import { UserStatusAudit } from './UserStatusAudit';
import { ModelCategory } from './ModelCategory';
import { License } from './License';
import { Model3d } from './Model3d';
import { FileType } from './FileType';
import { ModelFile } from './ModelFile';
import { ModelPreview } from './ModelPreview';
import { ModelLicense } from './ModelLicense';
import { Tag } from './Tag';
import { ModelTag } from './ModelTag';
import { ModelRating } from './ModelRating';
import { ModelComment } from './ModelComment';
import { Collection } from './Collection';
import { CollectionItem } from './CollectionItem';
import CommentAttachment from './CommentAttachment';
import Country from './Country';
import City from './City';

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
  };

  // Установка связей после инициализации всех моделей
  Object.values(models).forEach(model => {
    if (model.associate) {
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
  City
};


/**
tags — поле name и slug

model_categories — поле name и slug

models_3d — поле slug

auth_providers — поле name

roles — поле name

user_statuses — поле name

profiles — contact_email (если в системе email уникальный)

countries — как уже указано, поле name

file_types — extension (например, ".STL" и ".stl" считаются одинаковыми, если нужно)

token_types — поле name

-- countries.name
CREATE UNIQUE INDEX countries_name_ci_idx ON countries (LOWER(name));

-- tags.name и tags.slug
CREATE UNIQUE INDEX tags_name_ci_idx ON tags (LOWER(name));
CREATE UNIQUE INDEX tags_slug_ci_idx ON tags (LOWER(slug));

-- model_categories.name и model_categories.slug
CREATE UNIQUE INDEX model_categories_name_ci_idx ON model_categories (LOWER(name));
CREATE UNIQUE INDEX model_categories_slug_ci_idx ON model_categories (LOWER(slug));

-- models_3d.slug
CREATE UNIQUE INDEX models_3d_slug_ci_idx ON models_3d (LOWER(slug));

-- auth_providers.name
CREATE UNIQUE INDEX auth_providers_name_ci_idx ON auth_providers (LOWER(name));

-- roles.name
CREATE UNIQUE INDEX roles_name_ci_idx ON roles (LOWER(name));

-- user_statuses.name
CREATE UNIQUE INDEX user_statuses_name_ci_idx ON user_statuses (LOWER(name));

-- file_types.extension
CREATE UNIQUE INDEX file_types_extension_ci_idx ON file_types (LOWER(extension));

-- profiles.contact_email
CREATE UNIQUE INDEX profiles_contact_email_ci_idx ON profiles (LOWER(contact_email));

-- token_types.name
CREATE UNIQUE INDEX token_types_name_ci_idx ON token_types (LOWER(name));

 */