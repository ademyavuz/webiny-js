// @flow
import gql from "graphql-tag";
import { getPlugins } from "webiny-plugins";
import type { PageBuilderPageSettingsPluginType } from "webiny-app-cms/types";

const error = `
error {
    code
    message
}`;

const sharedFields = `
    id
    title
    url
    version
    parent
    published
    isHomePage
    isErrorPage
    isNotFoundPage
    locked
    savedOn
`;

export const createPage = gql`
    mutation CmsCreatePage($category: ID!) {
        cms {
            pageBuilder {
                page: createPage(data: { category: $category }) {
                    data {
                        id
                    }
                    ${error}
                }
            }
        }
    }
`;

export const listPages = gql`
    query CmsListPages($sort: JSON, $page: Int, $perPage: Int, $search: String) {
        cms {
            pageBuilder {
                pages: listPages(sort: $sort, page: $page, perPage: $perPage, search: $search) {
                    data {
                        ${sharedFields}
                        category {
                            id
                            name
                        }
                        createdBy {
                            firstName
                            lastName
                        }
                    }
                    meta {
                        totalCount
                        to
                        from
                        nextPage
                        previousPage
                    }
                }
            }
        }
    }
`;

export const getPage = () => gql`
    query CmsGetPage($id: ID!) {
        cms {
            pageBuilder {
                page: getPage(id: $id) {
                    data {
                        ${sharedFields}
                        snippet
                        content
                        settings {
                            _empty
                            ${getPlugins("pb-editor-page-settings")
                            .map((pl: PageBuilderPageSettingsPluginType) => pl.fields)
                            .join("\n")}
                        }
                        category {
                            id
                            name
                            url
                        }
                        revisions {
                            ${sharedFields}
                        }
                    }
                    ${error}
                }
            }
        }
    }
`;

export const createRevisionFrom = gql`
    mutation CmsCreateRevisionFrom($revision: ID!) {
        cms {
            pageBuilder {
                revision: createRevisionFrom(revision: $revision) {
                    data {
                        id
                    }
                    ${error}
                }
            }
        }
    }
`;

export const publishRevision = gql`
    mutation CmsPublishRevision($id: ID!) {
        cms {
            pageBuilder {
                publishRevision(id: $id) {
                    data {
                        ${sharedFields}
                    }
                    ${error}
                }
            }
        }
    }
`;

export const deleteRevision = gql`
    mutation CmsDeleteRevision($id: ID!) {
        cms {
            pageBuilder {
                deleteRevision(id: $id) {
                    data
                    ${error}
                }
            }
        }
    }
`;

export const deletePage = gql`
    mutation DeletePage($id: ID!) {
        cms {
            pageBuilder {
                deletePage(id: $id) {
                    data
                    ${error}
                }
            }
        }
    }
`;

const elementFields = /*GraphQL*/ `
    id
    name
    type
    category
    content
    preview {
        src
        meta
    }
`;

export const listElements = gql`
    query CmsListElements {
        cms {
            pageBuilder {
                elements: listElements(perPage: 1000) {
                    data {
                        ${elementFields}
                    }
                }
            }
        }
    }
`;

export const createElement = gql`
    mutation CmsCreateElement($data: ElementInput!) {
        cms {
            pageBuilder {
                element: createElement(data: $data) {
                    data {
                        ${elementFields}
                    }
                    ${error}
                }
            }
        }
    }
`;

export const updateElement = gql`
    mutation CmsUpdateElement($id: ID!, $data: UpdateElementInput!) {
        cms {
            pageBuilder {
                element: updateElement(id: $id, data: $data) {
                    data {
                        ${elementFields}
                    }
                    ${error}
                }
            }
        }
    }
`;
