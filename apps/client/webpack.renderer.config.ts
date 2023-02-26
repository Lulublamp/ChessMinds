import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },
  {
    test: /\.png/,
    type: 'asset/resource'
  }
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  output: {
    assetModuleFilename: 'assets/[name][ext]',
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
