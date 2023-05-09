import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },

  {
    test: /\.mp3$/,
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]',
    },
  },
  
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
