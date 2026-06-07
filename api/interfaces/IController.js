module.exports = class IController {
  index(request, response, next) {
    throw new Error(
      `[IController] O método 'index' deve ser implementado por ${this.constructor.name}`,
    );
  }

  store(request, response, next) {
    throw new Error(
      `[IController] O método 'store' deve ser implementado por ${this.constructor.name}`,
    );
  }

  show(request, response, next) {
    throw new Error(
      `[IController] O método 'show' deve ser implementado por ${this.constructor.name}`,
    );
  }

  update(request, response, next) {
    throw new Error(
      `[IController] O método 'update' deve ser implementado por ${this.constructor.name}`,
    );
  }

  destroy(request, response, next) {
    throw new Error(
      `[IController] O método 'destroy' deve ser implementado por ${this.constructor.name}`,
    );
  }
};
