-- Schema Changes

DROP TABLE "METRIC2"."M2_USER_CONNECTIONS"; -- No data in this table so its safe just to drop and recreate
CREATE ROW TABLE "METRIC2"."M2_USER_CONNECTIONS"  ("API_NAME" VARCHAR(100) CS_STRING, "USER_ID" INT CS_INT, "CLIENT_ID" VARCHAR(400) CS_STRING, "CLIENT_SECRET" VARCHAR(400) CS_STRING, "REFRESH_TOKEN" VARCHAR(400) CS_STRING, "ACCESS_TOKEN" VARCHAR(400) CS_STRING, "TOKEN_EXPIRES" LONGDATE CS_LONGDATE ) ;


INSERT INTO "METRIC2"."M2_WIDGET" VALUES (51,'Google+ API', '51.png','Service','metricGooglePlusProfile','Client','Displays data from your Google + account, Connections, circles and more.', 8, 1, 1, 1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (52,'Github API', '52.png','Service','metricGithubProfile','Client','Displays data from your Github account, followers, following and repositories.', 8, 1, 1, 1);

-- 51. Google API
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (195,51,'GoogleAPI','OAUTH','OAUTH',100,0,'','Google API Access','false',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (196,51,'URL','OPTION',' ',300,0,'Required, Backend API Call to make','Google API','true',5,0, null);

-- 52. Github
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (197,52,'GithubAPI','OAUTH','OAUTH',100,0,'','Github API Access','false',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (198,52,'URL','OPTION',' ',300,0,'Required, Backend API Call to make','Github API','true',6,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (29, 'https://www.googleapis.com/plus/v1/people/me circledByCount', 'My Profile: Circled By Count', 5);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (30, 'https://www.googleapis.com/plus/v1/people/me/people/collection?collection=connected totalItems', 'My Profile: Connection Count', 5);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (33, 'https://www.googleapis.com/plus/v1/people/me/circles circledByCount', 'My Profile: Circled By Count', 5);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (31, 'https://api.github.com/users/followers followers', 'My Profile: Followers', 6);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (32, 'https://api.github.com/users/followers public_repos', 'My Profile: Public Repo Count', 6);


-- Create Connections
INSERT INTO METRIC2.M2_USER_CONNECTIONS (API_NAME) VALUES ('GoogleAPI');
INSERT INTO METRIC2.M2_USER_CONNECTIONS (API_NAME) VALUES ('GithubAPI');
