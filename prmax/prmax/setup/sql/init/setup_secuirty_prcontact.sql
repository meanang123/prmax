GRANT INSERT,UPDATE,DELETE,SELECT ON  visit, visit_identity TO prcontact;

GRANT SELECT ON tg_group, permission, user_group, group_permission  TO prcontact;
GRANT SELECT,UPDATE ON  tg_user  TO prcontact;

GRANT SELECT ON user_external_view TO prcontact;


