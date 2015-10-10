PagedSubscription = function(name, selectors, query, callbacks, options) {
  // force to be called with `new`
  if (! (this instanceof PagedSubscription)) {
    return new PagedSubscription(name, selectors, query, callbacks, options);
  }

  if (! options || ! options.defaults) {
    options.defaults = { increment: 10 };
  }
  this.loadMoreTemplate = options.loadMoreTemplate || Template.paginationLoadMore;
  this.loadingTemplate = options.loadingTemplate || Template.paginationLoading;

  this.increment = options.defaults.increment;
  this.limit = new ReactiveVar(options.defaults.limit || this.increment);
  this.sort = new ReactiveVar(options.defaults.sort);

  this.subscribe = function(instance) {
    const pagedQuery = _.extend({
      limit: this.limit.get(), sort: this.sort.get()
    }, query);

    return instance.subscribe(name, selectors, pagedQuery, callbacks);
  };

  this.hasMore = function() {
    return options.hasMore();
  };

  this.limitInc = function() {
    this.limit.set(this.limit.get() + this.increment);
  };
};
/*
class Pagination {

  constructor(options) {
    this._deps = new ReactiveVar({
      query: options.query,
      limit: options.limit,
      increment: options.increment,
      sort: options.sort
    });
  }


  subscribe(instance, callback) {
    instance.autorun(function() {
      const deps = this._deps.get();

      instance.subscribe('postsList', query, { limit: limit, sort: sort });
    });
  }

  change() {

  }

  nextPage() {

  }
}
*/
