DROP VIEW user_external_view;
CREATE OR REPLACE VIEW user_external_view AS SELECT
u.user_id,u.user_name, u.email_address, u.display_name,u.projectname,
u.interface_font_size, u.interface_font_family, u.show_dialog_on_load, u.showmenubartext,
u.autoselectfirstrecord,u.isuseradmin,
u.usepartialmatch,
u.searchappend,
u.emailreplyaddress,
u.test_extensions,
u.stdview_sortorder,
u.canviewfinancial,
u.client_name,
u.issue_description
FROM tg_user as u;

GRANT SELECT ON user_external_view TO prmax;
