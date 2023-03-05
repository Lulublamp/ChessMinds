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
    loader: 'file-loader',
    type: 'asset/resource',
    options: {
      name: '[name].[ext]',
    }
  }
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  output: {
    assetModuleFilename: 'images/[name][ext]',
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
