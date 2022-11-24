DROP FUNCTION IF EXISTS seo_releasecategories() CASCADE;

CREATE OR REPLACE FUNCTION seo_releasecategories()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  #if controlSettings.isDisabled==1:
  #  return None

  #controlSettings.doDebug(TD)

  index_fields = (
    ( Constants.seo_categories ,'seocategoryid',None,None),
  )

  indexer = StandardIndexer(
	SD,
	plpy,
	'seoreleaseid',
	TD,
	index_fields,
	controlSettings.getIndexRebuildMode())
  indexer.set_no_customer()
  indexer.RunIndexer()




$$ LANGUAGE plpythonu;

CREATE TRIGGER seoreleasecategories_add AFTER INSERT ON seoreleases.seoreleasecategories for each row EXECUTE PROCEDURE seo_releasecategories();
CREATE TRIGGER seoreleasecategories_update AFTER UPDATE ON seoreleases.seoreleasecategories for each row EXECUTE PROCEDURE seo_releasecategories();
CREATE TRIGGER seoreleasecategories_delete AFTER DELETE ON seoreleases.seoreleasecategories for each row EXECUTE PROCEDURE seo_releasecategories();