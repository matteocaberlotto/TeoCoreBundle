<?php

namespace Teo\CoreBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class TeoCoreExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.xml');

        $lastModified = $this->setupLastModified($container);

        // basic html parameters
        $container->setParameter('teo_core.website', $config['website']);

        // sitemap uri list
        array_walk($config['sitemap'], function (&$entry) use($lastModified) {
            $entry['lastmod'] = $lastModified;
        });

        $container->setParameter('teo_core.sitemap_uris', $config['sitemap']);
    }

    protected function setupLastModified($container)
    {

        // set last_modified parameter
        $parametersFile = $container->getParameter('kernel.root_dir') . '/config/parameters.yml';

        if (file_exists($parametersFile)) {
            $lastModified = gmdate("Y-m-d\TH:i:sP", filemtime($parametersFile));
        } else {
            $lastModified = gmdate("Y-m-d\TH:i:sP", time());
        }

        $container->setParameter('last_modified', $lastModified);

        return $lastModified;
    }
}
