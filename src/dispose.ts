/**
 * 取消登记时调用的函数，没有参数、没有返回值。
 * `locale.register`、`slots.inject`、`slots.register`、`ctx.on`、`ctx.effect` 都会给出这样一个函数。
 * 调用它只撤掉这一次登记，不影响插件的其他登记。
 */
export type Dispose = () => void
